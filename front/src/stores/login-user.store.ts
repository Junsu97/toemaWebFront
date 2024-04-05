import { User } from 'types/interface';
import { create } from 'zustand';

interface LoginUserStore{
    loginUser :  User | null;
    setLoginUser : (loginUser : User) => void;
    resetLoginUser : () => void;
};

/**
 * 전역 적으로 사용하는 상태변수
 * 
 */
const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser : null, // 상태 값
    setLoginUser: loginUser => set(state => ({...state, loginUser})), // 상태 변경
    resetLoginUser : () => set(state => ({...state, loginUser : null})) // 상태 변경
}));

export default useLoginUserStore;