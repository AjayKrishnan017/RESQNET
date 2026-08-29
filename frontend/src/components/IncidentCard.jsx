function IncidentCard({ incident }) {
    const latitude = incident.location?.latitude;
    const longitude = incident.location?.longitude;

    return (
        <div className="incident-card">

            <h3>
                {incident.title}
            </h3>

            <p className="incident-description">
                {incident.description}
            </p>

            <div className="incident-info">

                <p>
                    <strong>Type:</strong>{" "}
                    {incident.disasterType}
                </p>

                <p>
                    <strong>Severity:</strong>{" "}
                    {incident.severity}
                </p>

                <p>
                    <strong>People Affected:</strong>{" "}
                    {incident.peopleAffected}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {incident.status?.replace("_", " ")}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {latitude !== undefined && longitude !== undefined
                        ? `${latitude}, ${longitude}`
                        : "Location unavailable"}
                </p>

            </div>

        </div>
    );
}

export default IncidentCard;