// 0. If using a module system, call Vue.use(VueRouter)
Vue.use(VueRouter);
// 1. Define route components.
// These can be imported from other files
const friut = { template: '<div>fruit</div>' }
const vegetables = { template: '<div>vegetables</div>' }
const others = { template: '<div>others</div>' }
const ingredients = { template: '<div>ingredients</div>'}

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/fruit', component: friut },
  { path: '/vegetables', component: vegetables },
  { path: '/others',component:others },
  { path: '/check_ingredients', component:ingredients }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router
}).$mount('#route_type')

// Now the app has started!