enum ResponseCode {
      /** HTTP Status 200*/
      SUCCESS = "SU" ,

      /** HTTP Status 400*/
      VALIDATION_FAILED = "VF" ,
      DUPLICATE_ID = "DI" ,
      DUPLICATE_APPLY = "DA",
      DUPLICATE_NICKNAME = "DN" ,
      DUPLICATE_EMAIL = "DE" ,
      DUPLICATE_TEL_NUMBER = "DT",
  
      NOT_EXISTED_USER = "NU" ,
      NOT_EXISTED_BOARD = "NB" ,
      NOT_EXISTED_APPLY = "NA",
      NOT_EXISTED_COMMENT = "NC",
      NOT_EXISTED_HOMEWORK = "NH",
      NOT_EXISTED_MATCH = "NM",
      NOT_EXISTED_TUTORING = "NT",
  
      /** HTTP Status 401*/
      SIGN_IN_FAIL = "SF" ,
      AUTHORIZATION_FAIL = "AF" ,
  
  
      /** HTTP Status 403*/ 
      NO_PERMISSION = "NP" ,
  
      /** HTTP Status 500*/
      DATABASE_ERROR = "DBE" ,
}

export default ResponseCode;