import AuditLog from "../models/auditlog.js";


export const getAuditLogs =
    async (req, res) => {

        try {

            const page =
                Math.max(
                    1,
                    Number(
                        req.query.page
                    ) || 1
                );


            const limit =
                Math.min(
                    100,

                    Math.max(
                        1,
                        Number(
                            req.query.limit
                        ) || 30
                    )
                );


            const filter = {};


            if (
                req.query.action
            ) {

                filter.action =
                    req.query.action;

            }


            if (
                req.query.entityType
            ) {

                filter.entityType =
                    req.query.entityType;

            }


            if (
                req.query.search
            ) {

                const search =
                    new RegExp(
                        req.query.search,
                        "i"
                    );


                filter.$or = [

                    {
                        actorName:
                            search
                    },

                    {
                        actorEmail:
                            search
                    },

                    {
                        description:
                            search
                    }

                ];

            }


            const skip =
                (
                    page - 1
                ) *
                limit;


            const [
                logs,
                total
            ] =
                await Promise.all([

                    AuditLog.find(
                        filter
                    )
                        .sort({
                            createdAt: -1
                        })
                        .skip(
                            skip
                        )
                        .limit(
                            limit
                        )
                        .lean(),

                    AuditLog.countDocuments(
                        filter
                    )

                ]);


            res.status(200).json({

                success: true,

                logs,

                pagination: {

                    page,

                    limit,

                    total,

                    pages:
                        Math.max(
                            1,
                            Math.ceil(
                                total /
                                limit
                            )
                        )

                }

            });


        } catch (error) {

            console.error(
                "Audit log error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Failed to load audit logs."
            });

        }

    };