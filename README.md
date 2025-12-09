### Project Name & Live URL.
Vehicle Rental System
Live Url: [https://assingment-amber.vercel.app](https://assingment-amber.vercel.app)

### Technology Stack
1. Express
2. bcryptjs
3. jsonwebtoken
4. pg
5. typescript


### module pattern
1. user can registration and login.
   signup api - https://assingment-amber.vercel.app/api/v1/auth/signup_
   login api - https://assingment-amber.vercel.app/api/v1/auth/signin_
   
3. admin can vehicle get, edit, update and delete and user can get all vehicle data
    vehicle post api(admin) - https://assingment-amber.vercel.app/api/v1/vehicles
    vehicle get api(admin & customer) - https://assingment-amber.vercel.app/api/v1/vehicles/:vehicleId
    vehicle update api(admin) - https://assingment-amber.vercel.app/api/v1/vehicles/:vehicleId
    vehicle delete api(admin) - https://assingment-amber.vercel.app/api/v1/vehicles/:vehicleId
   
2. admin can handle user profile and user also update his/her profile.
    user get api(admin & user) - https://assingment-amber.vercel.app/api/v1/users/:userId
    user update api(admin & user) - https://assingment-amber.vercel.app/api/v1/users/:userId
    user delete api(admin) - https://assingment-amber.vercel.app/api/v1/users/:userId
   
2. user can book vehicle and can modify , and admin also.
    create booking api(user) - https://assingment-amber.vercel.app/api/v1/bookings
    booking get api(admin & customer) - https://assingment-amber.vercel.app/api/v1/bookings/:bookingId
    booking update api(admin & user) - https://assingment-amber.vercel.app/api/v1/bookings/:bookingId
    booking delete api(admin) - https://assingment-amber.vercel.app/api/v1/bookings/:bookings


### Github and Vercel live link
Vercel Live Link : [Click Here](https://assingment-amber.vercel.app)
Github Link : [Click Here](https://github.com/remontripura/assingment-02)



   
