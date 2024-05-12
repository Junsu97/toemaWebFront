export default interface TeacherListItemInterface{
    userId: string,
    profileImage: string | null,
    school: string,
    korean: boolean,
    math: boolean,
    science: boolean,
    social: boolean,
    english: boolean,
    desc: string
}