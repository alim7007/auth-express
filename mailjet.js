const mailjet = require ('node-mailjet')
.connect('950c69fab054149b52fa80ba96cab2ee', 'eb9f795dccd1a796457f2cb31eb4cd52')

const SendMailJet = async (req, savedUser, reset) =>{
    let token 
    if(reset === "reset"){
        token = await savedUser.resetPasswordToken
    }else{
        token = await savedUser.emailToken
    }
    mailjet
    .post("send", {'version': 'v3.1'})
        .request({
        "Messages":[
            {
            "From": {
                "Email": "olimtoni7007@gmail.com",
                "Name": "Olim"
            },
            "To": [
                {
                "Email": savedUser.email,
                "Name": "Olim"
                }
            ],
            "Subject": "Greetings from Mailjet.",
            "TextPart": "My first Mailjet email",
            "HTMLPart": `<a href=http://${req.headers.host}/api/user/${reset === "reset" ? "verify-reset":"verify-email"}?token=${token}>Verify your account</a>
            <p>http://${req.headers.host}/api/user/${reset === "reset" ? "verify-reset":"verify-email"}?token=${token}</p>
            `,
            "CustomID": "AppGettingStartedTest"
            }
        ]
        }
    )
} 

module.exports = { SendMailJet }