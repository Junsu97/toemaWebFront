export default interface User{
    userId : string;
    userName : string;
    nickname : string;
    email : string;
    emailAuth : boolean|null;
    userType: string;
    addr: string;
    addrDetail: string;
    school: string | null;
    telNumber:string;
    faceId : string | null;
    profileImage : string | null;
};