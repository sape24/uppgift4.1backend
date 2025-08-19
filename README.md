## Restwebbtjänst 
Webbtjänst som hanterar autentisering med hjälp av NodeJS, Express, MongoDB, dotenv, bcrypt och JWT


## Användning

Nedan finns beskrivet hur man når APIet på olika vis:

| Metod  | Ändpunkt        | Beskrivning                                                       |
|--------|-----------------|-------------------------------------------------------------------|
| POST   | /api/register   | Registrerar en ny användare.                                      |
| POST   | /api/login      | Loggar in användare och returnerar en JWT.                        |
| GET    | /api/protected  | Skyddad route som kräver giltig JWT.                              |

Vid registrering skickas användaren in som JSON:

```json
{
   "username": "test",
   "password": "12345"
}
```
Vid inloggning returneras en JWT Token i svaret:

```json
{
   "response": {
      "message":"user logged in",
      "token": "JWT Token"
   }
}
``` 

För att nå skyddad route krävs det att skicka med token i headers.