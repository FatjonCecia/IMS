const router = require("express").Router();


const routes= [
    {
        path:'/auth',
        route:require("./Auth.route")
    },
    {
        path: '/inventory',
        route: require("./Inventory.routes")
    },
    {
        path: '/location',           // ← add this
        route: require("./Location.routes") // ← point to your locations.js
    }
]


routes.forEach((cur)=>{
    router.use(cur.path,cur.route);
})

module.exports = router