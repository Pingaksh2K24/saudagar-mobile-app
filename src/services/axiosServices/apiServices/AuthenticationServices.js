import { axiosPost } from '../AxiosRequests';
import { UserLogin, Logout } from '../ApiEndPoints';

export default class AuthenticationServices {

    async userLogin(request) {
        return axiosPost(UserLogin, request);
    }
    async logout(request) {
        return axiosPost(Logout, request);
    }

}