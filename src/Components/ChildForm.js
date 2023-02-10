import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

export default function ChildForm({ register, number, errors }) {

    return (
        <div>
            <div className="col-md-4">
                <h4>ילד {number}</h4>
                <label className="form-label">שם</label>
                <input onInput={(e) => { sessionStorage.setItem(`child${number}firstName`, e.target.value) }} defaultValue={sessionStorage.getItem(`child${number}firstName`)}
                    {...register(`child${number}name`, { required: true })} className="form-control" />

                   {errors[`child${number}name`]?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                
            </div>

            <div className="col-md-4">
                <label className="form-label">תאריך לידה</label>
                <input onInput={(e) => { sessionStorage.setItem(`child${number}dateOfBirth`, e.target.value) }} defaultValue={sessionStorage.getItem(`child${number}dateOfBirth`)}
                    type="date" {...register(`child${number}DateOfBirth`, { required: true })} className="form-control" />
                    
                { errors[`child${number}DateOfBirth`]?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
            </div>

            <div class="col-md-4">

                <label className="form-label">תעודת זהות (כולל ספרת ביקורת)</label>
                <input onInput={(e) => { sessionStorage.setItem(`child${number}tz`, e.target.value) }} defaultValue={sessionStorage.getItem(`child${number}tz`)}
                    {...register(`child${number}Tz`, { required: true, minLength: 9, maxLength: 9, pattern: /^[0-9]*$/ })} className="form-control" />
                {errors[`child${number}Tz`]?.type === 'pattern' && <p style={{ color: "red" }}>יש להזין ספרות בלבד</p>}
                {errors[`child${number}Tz`]?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                {errors[`child${number}Tz`]?.type === 'maxLength' && <p style={{ color: "red" }}>המספר ארוך מ9 ספרות</p>}
                {errors[`child${number}Tz`]?.type === 'minLength' && <p style={{ color: "red" }}>המספר קצר מ9 ספרות</p>}
            </div>

        </div>
    )
}