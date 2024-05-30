export default interface CommentListDTO{
    commentNumber : number;
    boardNumber : number;
    nickname : string;
    profileImage : string | null;
    writeDatetime : string;
    content : string;
}