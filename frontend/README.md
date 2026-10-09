# Angular frontend starter

Create a workspace with:
`npx -y @angular/cli@18 new complytrack-ui --standalone --routing --style=css`

Then copy this `src/app` folder into the generated workspace's `src/app`. Run `npm start` from the generated workspace after adding `"start": "ng serve"` to its package.json scripts.

The API service uses `http://localhost:8080/api/v1`. Add an HTTP interceptor for the JWT token after login. This starter UI is a scaffold and requires local Angular CLI workspace generation to run.
