import defautltProfileImage from "../../../../assets/image/default-profile-image.png";

export default function ApplyDetail(){
    return(
        <div id='wrapper'>
            <div className="side_wrapper">
                <section className="about-dev">
                    <header className="profile-card_header">
                        <div className="profile-card_header-container">
                            <h1>{'선생아이디'}<span>{'학생아이디'}</span></h1>
                        </div>
                    </header>
                    <div className="profile-card_about">
                        <h2>신청 메시지</h2>
                        <p>{'확인중'}</p>
                        <footer className="profile-card_footer">
                            <div className="social-row">
                                <div className="heart-icon" title="No Health Issues">
                                    {/* SVG content here */}
                                </div>
                                <div className="paw-icon" title="Gets Along Well With Other Animals">
                                    {/* SVG content here */}
                                </div>
                            </div>
                            <p><a className="back-to-profile">수정하기</a><a className="back-to-profile">신청취소</a></p>
                        </footer>
                    </div>
                </section>
            </div>
        </div>
    )
}