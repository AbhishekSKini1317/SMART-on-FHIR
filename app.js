var myApp = {}
FHIR.oauth2.ready()
    .then(function (client) {
        myApp.smart = client
        patientRequests();
        userRequests();
        tokenDisplay();
    }).catch(() => {
        console.log("Authorization unsuccessful")
    }
    )

async function patientRequests() {
    var patientDetails = await fetch(myApp.smart.state.serverUrl + "/Patient/" + myApp.smart.patient.id, {
        headers: {
            "Accept": "application/json+fhir",
            "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
        }
    }).then(function (data) {
        return data
    });
    var patientResponse = await patientDetails.json()
    console.log(patientResponse)
    var firstName = patientResponse.name ? (patientResponse.name[0].given || 'Nil') : 'Nil';
    var lastName = patientResponse.name ? (patientResponse.name[0].family || 'Nil') : 'Nil';
    var mobile = patientResponse.telecom ? (patientResponse.telecom[0].value || 'Nil') : 'Nil';
    var language = patientResponse.communication ? (patientResponse.communication[0].language.text || 'Nil') : 'Nil';
    var gender = patientResponse.gender || 'Nil';
    var DOB = patientResponse.birthDate || 'Nil';
    var address = patientResponse.contact ? (patientResponse.contact[0].address ? JSON.stringify(patientResponse.contact[0].address, null, "\t") : 'Nil') : 'Nil';

    $("#lastName").html(lastName)
    $("#firstName").html(firstName)
    $("#mobile").html(mobile)
    $("#language").html(language)
    $("#gender").html(gender)
    $("#DOB").html(DOB)
    $("#address").html(address)

    console.log(myApp.smart)
}
async function userRequests() {
    const id_token = myApp.smart.state.tokenResponse.id_token;
    const client = new FHIR.client({
        serverUrl: myApp.smart.state.serverUrl,
        tokenResponse: { id_token }
    });
    console.log(client.user.fhirUser)
    var userDetails = await fetch(client.user.fhirUser, {
        headers: {
            "Accept": "application/json+fhir",
            "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
        }
    }).then(function (data) {
        return data
    });
    var userResponse = await userDetails.json();
    console.log(userResponse);

    var firstName = userResponse.name ? (userResponse.name[0].given || 'Nil') : 'Nil';
    var lastName = userResponse.name ? (userResponse.name[0].family || 'Nil') : 'Nil';
    var id = userResponse.id;

    $("#ulastName").html(lastName)
    $("#ufirstName").html(firstName)
    $("#uid").html(id)
}


async function tokenDisplay() {
    var tokenResponse = JSON.stringify(myApp.smart.state.tokenResponse, null, "\t");
    var refreshToken = JSON.stringify(myApp.smart.state.tokenResponse.refresh_token);
    var token = myApp.smart.state.tokenResponse.id_token;
    var decodedToken = parseJwt(JSON.stringify(token));
    console.log(decodedToken)

    $('#tokenResponse').html(tokenResponse)
    $('#decodedId').html(JSON.stringify(decodedToken, null, "\t"))
    $('#refreshToken').html(refreshToken)

}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};



