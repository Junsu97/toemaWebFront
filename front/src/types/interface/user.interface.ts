export default interface User{
    userId : string;
    nickname : string;
    email : string;
    userType: string;
    school: string | null;
    schoolAuth: boolean|null;
    faceId : string | null;
    profileImage : string | null;
};