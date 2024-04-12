export default interface SignUpRequestDTO{
    userId : string; //1 
    password: string; //1
    email:string; //1 
    userType : string; //1
    nickname: string; // 2
    telNumber: string; // 2
    addr: string; //2 
    addrDetail: string; //2
    school : string | null; // 3
    userName : string; // 3 
    agreedPersonal: boolean; //3
}