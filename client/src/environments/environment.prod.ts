const serverRoot: string = `http://${window.location.host}:${window.location.port}/server`;
export const environment = {
  corsUrl: `http://${window.location.host}:${window.location.port}/client`,
  production: true,
  login: `${serverRoot}/login`,
  initialRegistration: `${serverRoot}/register`,
  api: {
    userInfo: `${serverRoot}/api/v1/info`,
    reimbursements: `${serverRoot}/api/v1/reimbursements`,
    myReimbursements: `${serverRoot}/api/v1/reimbursements/mine`,
  },
};
