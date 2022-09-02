function getFhirData() {
    const clientId = document.querySelector('input').value;
    console.log(clientId);
    FHIR.oauth2.authorize({
        'client_id': clientId,
        'scope': 'user/Patient.read user/Practitioner.read launch openid profile offline_access fhiruser',
        'redirect_uri': 'https://abhishekskini1317.github.io/SMART-on-FHIR.github.io/app.html'
    });
}
