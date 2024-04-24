export default interface Board {
    boardNumber : number;
    title :string;
    content : string;
    boardImageList : string[];
    writeDatetime: string;
    writerId: string;
    writerNickname: string;
    writerProfileImage: string|null;
}

