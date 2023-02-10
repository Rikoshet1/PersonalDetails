import React, { useRef, useState, useEffect, useContext } from 'react';

export default function Guidelines(){


    return(
        <div>
       <h2>שלום {sessionStorage.getItem("firstName")} {sessionStorage.getItem("lastName")}</h2>
       <h3>הנחיות למילוי הטופס</h3>
       <p>יש למלא את הפרטים כמתבקש וכן את פרטי הילדים</p>
       <p>כל השדות הם שדות חובה</p>
       <p>ניתן לחזור לטופס שוב ולשנות את הפרטים </p>
        </div>
    )
}