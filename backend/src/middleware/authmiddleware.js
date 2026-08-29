import jwt from "jsonwebtoken";


// ========================================
// PROTECT ROUTE
// ========================================

export const protect =
    (req, res, next) => {

        try {

            const authorization =
                req.headers.authorization;


            if (
                !authorization ||
                !authorization.startsWith(
                    "Bearer "
                )
            ) {

                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Authentication required."
                    });

            }


            const token =
                authorization.split(
                    " "
                )[1];


            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


            req.user = {
                id:
                    decoded.id,

                role:
                    decoded.role
            };


            next();

        } catch (error) {

            return res
                .status(401)
                .json({
                    success: false,
                    message:
                        "Invalid or expired token."
                });

        }

    };


// ========================================
// ROLE AUTHORIZATION
// ========================================

export const authorize =
    (...allowedRoles) => {

        return (
            req,
            res,
            next
        ) => {

            if (
                !req.user
            ) {

                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Authentication required."
                    });

            }


            if (
                !allowedRoles.includes(
                    req.user.role
                )
            ) {

                return res
                    .status(403)
                    .json({
                        success: false,
                        message:
                            "You do not have permission to perform this action."
                    });

            }


            next();

        };

    };