import AuditLog from "../models/auditlog.js";
import Notification from "../models/notification.js";


// ========================================
// REMOVE SENSITIVE DATA
// ========================================

const sanitize = (value) => {

    if (
        value === null ||
        value === undefined
    ) {
        return value;
    }


    if (Array.isArray(value)) {

        return value.map(
            sanitize
        );

    }


    if (
        typeof value ===
        "object"
    ) {

        const clean = {};


        for (
            const [key, item]
            of Object.entries(value)
        ) {

            const lowerKey =
                key.toLowerCase();


            if (
                lowerKey.includes(
                    "password"
                ) ||
                lowerKey.includes(
                    "token"
                ) ||
                lowerKey.includes(
                    "authorization"
                ) ||
                lowerKey.includes(
                    "secret"
                )
            ) {

                continue;

            }


            clean[key] =
                sanitize(item);

        }


        return clean;

    }


    return value;

};


// ========================================
// ENTITY TYPE
// ========================================

const getEntityType = (path) => {

    if (
        path.includes(
            "/api/incidents"
        )
    ) {
        return "INCIDENT";
    }


    if (
        path.includes(
            "/api/responders"
        )
    ) {
        return "RESPONDER";
    }


    if (
        path.includes(
            "/api/assignments"
        )
    ) {
        return "DEPLOYMENT";
    }


    if (
        path.includes(
            "/api/shelters"
        )
    ) {
        return "SHELTER";
    }


    if (
        path.includes(
            "/api/resources"
        )
    ) {
        return "RESOURCE";
    }


    if (
        path.includes(
            "/api/users"
        )
    ) {
        return "USER";
    }


    return "SYSTEM";

};


// ========================================
// ACTION
// ========================================

const getAction = (
    method,
    path
) => {

    if (
        path.includes(
            "/assign"
        )
    ) {
        return "DEPLOY";
    }


    if (
        path.includes(
            "/release"
        )
    ) {
        return "RELEASE";
    }


    if (
        method === "POST"
    ) {
        return "CREATE";
    }


    if (
        method === "PUT" ||
        method === "PATCH"
    ) {
        return "UPDATE";
    }


    if (
        method === "DELETE"
    ) {
        return "DELETE";
    }


    return "ACTION";

};


// ========================================
// FIND ENTITY ID
// ========================================

const getEntityId = (
    req,
    responseBody
) => {

    return (
        req.params?.id ||

        req.params?.incidentId ||

        responseBody
            ?.incident
            ?._id ||

        responseBody
            ?.responder
            ?._id ||

        responseBody
            ?.shelter
            ?._id ||

        responseBody
            ?.resource
            ?._id ||

        responseBody
            ?.user
            ?._id ||

        responseBody
            ?._id ||

        req.body
            ?.incidentId ||

        req.body
            ?.responderId ||

        null
    );

};


// ========================================
// FIND DISPLAY NAME
// ========================================

const getEntityName = (
    req,
    responseBody
) => {

    return (

        responseBody
            ?.incident
            ?.title ||

        responseBody
            ?.responder
            ?.name ||

        responseBody
            ?.shelter
            ?.name ||

        responseBody
            ?.resource
            ?.name ||

        responseBody
            ?.user
            ?.name ||

        req.body?.title ||

        req.body?.name ||

        req.body?.teamName ||

        null

    );

};


// ========================================
// DESCRIPTION
// ========================================

const buildDescription = ({
    actorName,
    action,
    entityType,
    entityName
}) => {

    if (
        action === "DEPLOY"
    ) {

        return `${actorName} deployed a responder team.`;

    }


    if (
        action === "RELEASE"
    ) {

        return `${actorName} released a responder team.`;

    }


    const verbMap = {

        CREATE:
            "created",

        UPDATE:
            "updated",

        DELETE:
            "deleted"

    };


    const verb =
        verbMap[action] ||
        "modified";


    const formattedEntity =
        entityType
            .toLowerCase()
            .replaceAll(
                "_",
                " "
            );


    if (entityName) {

        return `${actorName} ${verb} ${formattedEntity} "${entityName}".`;

    }


    return `${actorName} ${verb} ${formattedEntity}.`;

};


// ========================================
// NOTIFICATION DETAILS
// ========================================

const buildNotification = ({
    req,
    action,
    entityType,
    entityName,
    entityId
}) => {

    let title =
        "RESQNET Update";

    let message =
        `${entityType} ${action.toLowerCase()} operation completed.`;

    let type =
        "INFO";

    let targetRoles = [
        "ADMIN",
        "DISPATCHER"
    ];


    // INCIDENTS

    if (
        entityType ===
        "INCIDENT"
    ) {

        targetRoles = [
            "ADMIN",
            "DISPATCHER",
            "RESPONDER"
        ];


        if (
            action ===
            "CREATE"
        ) {

            title =
                "🚨 New Incident Reported";

            message =
                entityName
                    ? `${entityName} has been reported.`
                    : "A new emergency incident has been reported.";

        }


        if (
            action ===
            "UPDATE"
        ) {

            title =
                "🚨 Incident Updated";

            message =
                entityName
                    ? `${entityName} has been updated.`
                    : "An emergency incident has been updated.";

        }


        if (
            action ===
            "DELETE"
        ) {

            title =
                "Incident Removed";

            message =
                "An incident was removed from RESQNET.";

        }


        const severity =
            req.body?.severity;


        if (
            severity ===
            "CRITICAL"
        ) {

            type =
                "CRITICAL";

        } else {

            type =
                "WARNING";

        }

    }


    // DEPLOYMENT

    if (
        entityType ===
        "DEPLOYMENT"
    ) {

        targetRoles = [
            "ADMIN",
            "DISPATCHER"
        ];


        if (
            action ===
            "DEPLOY"
        ) {

            title =
                "👨‍🚒 Responder Deployed";

            message =
                "A responder team has been deployed to an incident.";

            type =
                "SUCCESS";

        }


        if (
            action ===
            "RELEASE"
        ) {

            title =
                "Responder Released";

            message =
                "A responder has returned to available status.";

            type =
                "INFO";

        }

    }


    // RESPONDERS

    if (
        entityType ===
        "RESPONDER"
    ) {

        title =
            "Responder Management";

        message =
            entityName
                ? `${entityName} was ${action.toLowerCase()}d.`
                : `Responder record ${action.toLowerCase()} operation completed.`;

        targetRoles = [
            "ADMIN",
            "DISPATCHER"
        ];

    }


    // SHELTERS

    if (
        entityType ===
        "SHELTER"
    ) {

        title =
            "🏥 Shelter Update";

        message =
            entityName
                ? `${entityName} has been updated.`
                : "Shelter information has changed.";


        targetRoles = [
            "ADMIN",
            "DISPATCHER",
            "SHELTER_MANAGER"
        ];


        if (
            req.body?.status ===
            "FULL"
        ) {

            title =
                "⚠️ Shelter Full";

            type =
                "WARNING";

        }

    }


    // RESOURCES

    if (
        entityType ===
        "RESOURCE"
    ) {

        title =
            "📦 Resource Update";

        message =
            entityName
                ? `${entityName} inventory has changed.`
                : "Resource inventory has changed.";


        targetRoles = [
            "ADMIN",
            "DISPATCHER",
            "SHELTER_MANAGER"
        ];


        if (
            req.body?.status ===
                "LOW_STOCK" ||
            req.body?.status ===
                "OUT_OF_STOCK"
        ) {

            title =
                "⚠️ Resource Alert";

            type =
                "WARNING";

        }

    }


    // USERS

    if (
        entityType ===
        "USER"
    ) {

        title =
            "👥 User Management";

        message =
            entityName
                ? `${entityName}'s account was modified.`
                : "A RESQNET user account was modified.";


        targetRoles = [
            "ADMIN"
        ];

    }


    return {

        title,

        message,

        type,

        targetRoles,

        relatedEntityType:
            entityType,

        relatedEntityId:
            entityId

    };

};


// ========================================
// RECORD MUTATION
// ========================================

const recordMutation =
    async (
        req,
        responseBody,
        statusCode
    ) => {

        try {

            if (!req.user) {

                return;

            }


            const path =
                req.originalUrl;


            const entityType =
                getEntityType(
                    path
                );


            if (
                entityType ===
                "SYSTEM"
            ) {

                return;

            }


            const action =
                getAction(
                    req.method,
                    path
                );


            const entityId =
                getEntityId(
                    req,
                    responseBody
                );


            const entityName =
                getEntityName(
                    req,
                    responseBody
                );


            const actorName =
                req.user.name ||
                req.user.email ||
                "RESQNET User";


            const description =
                buildDescription({

                    actorName,

                    action,

                    entityType,

                    entityName

                });


            await AuditLog.create({

                actor:
                    req.user.id,

                actorName,

                actorEmail:
                    req.user.email ||
                    "",

                actorRole:
                    req.user.role ||
                    "",

                action,

                entityType,

                entityId,

                description,

                method:
                    req.method,

                path,

                statusCode,

                metadata: {

                    params:
                        sanitize(
                            req.params
                        ),

                    body:
                        sanitize(
                            req.body
                        )

                }

            });


            const notificationData =
                buildNotification({

                    req,

                    action,

                    entityType,

                    entityName,

                    entityId

                });


            await Notification.create(
                notificationData
            );


            // ========================================
            // REAL-TIME REFRESH EVENT
            // ========================================

            const io =
                req.app.get(
                    "io"
                );


            if (io) {

                // We intentionally don't send
                // notification contents here.
                // Each client fetches only the
                // notifications allowed for its role.

                io.emit(
                    "notifications:refresh",
                    {
                        timestamp:
                            new Date()
                                .toISOString()
                    }
                );

            }


        } catch (error) {

            console.error(
                "Audit middleware error:",
                error
            );

        }

    };


// ========================================
// MIDDLEWARE
// ========================================

const auditMutationMiddleware =
    (req, res, next) => {

        const mutationMethods = [
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ];


        if (
            !mutationMethods.includes(
                req.method
            )
        ) {

            return next();

        }


        // Don't log login/read-notification
        // actions as operational activity.

        if (
            req.originalUrl.startsWith(
                "/api/auth"
            ) ||

            req.originalUrl.startsWith(
                "/api/notifications"
            ) ||

            req.originalUrl.startsWith(
                "/api/audit"
            )
        ) {

            return next();

        }


        const originalJson =
            res.json.bind(res);


        res.json =
            (body) => {

                const statusCode =
                    res.statusCode;


                const result =
                    originalJson(
                        body
                    );


                if (
                    statusCode >= 200 &&
                    statusCode < 400
                ) {

                    void recordMutation(
                        req,
                        body,
                        statusCode
                    );

                }


                return result;

            };


        next();

    };


export default auditMutationMiddleware;