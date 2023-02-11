import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ChildForm from "./ChildForm";
import axios from "axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function Form() {


    const [numOfChildren, setNumOfChildren] = useState(initChildren())
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = () => {

        var excelData = [];
        var id = 0;

        let person = {
            firstName: sessionStorage.getItem("firstName"),
            lastName: sessionStorage.getItem("lastName"),
            tz: sessionStorage.getItem("tz"),
            date: sessionStorage.getItem("date"),
            sex: sessionStorage.getItem("sex"),
            healthFund: sessionStorage.getItem("healthFund")
        }

        excelData.push(person)

        //post person
        axios.post('https://localhost:7261/api/Person', person)
            .then((response) => {

                //find person id in server in order to send his children
                if (numOfChildren == 0)
                    return;

                axios.get('https://localhost:7261/api/Person')
                    .then((response) => {

                        var people = response.data

                        for (var i = 0; i < people.length; i++) {
                            if (people[i].tz === person.tz)
                                id = people[i].id
                        }


                        for (let i = 1; i <= numOfChildren.length; i++) {

                            let child = {
                                name: sessionStorage.getItem(`child${i}firstName`),
                                dateOfBirth: sessionStorage.getItem(`child${i}dateOfBirth`),
                                tz: sessionStorage.getItem(`child${i}tz`),
                                parentId: id
                            }

                            excelData.push(child)

                            //send children
                            axios.post('https://localhost:7261/api/Child', child)
                                .then(function (response) {

                                    // download excel file
                                    const fileType =
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                                    const fileExtension = ".xlsx";
                                    const fileName = "PersonalDetails"

                                    const ws = XLSX.utils.json_to_sheet(excelData);
                                    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
                                    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                                    const data = new Blob([excelBuffer], { type: fileType });
                                    FileSaver.saveAs(data, fileName + fileExtension);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });




    }


    function initChildren() {
        let number = sessionStorage.getItem("numOfChildren")
        if (number == null)
            number = 0;
        let arr = []
        for (let i = 0; i < number; i++) {
            arr.push(i + 1);
        }
        return arr;
    }

    function addChildren(number) {

        let arr = []
        for (let i = 0; i < number; i++) {
            arr.push(i + 1);
        }
        setNumOfChildren(arr)
    }

    const changeChildren = e => {
        sessionStorage.setItem("numOfChildren", e.target.value)
        addChildren(e.target.value)
    };


    return (

        <div>

            <form onSubmit={handleSubmit(onSubmit)} className="row g-3" style={{ margin: "100px" }}>

                <div className="col-md-6">
                    <label className="form-label">שם פרטי</label>

                    <input onInput={(e) => { sessionStorage.setItem("firstName", e.target.value) }} defaultValue={sessionStorage.getItem("firstName")}
                        {...register("firstName", { required: true })} className="form-control" />
                    {errors.firstName?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}

                </div>

                <div className="col-md-6">
                    <label className="form-label">שם משפחה</label>
                    <input onInput={(e) => { sessionStorage.setItem("lastName", e.target.value) }} defaultValue={sessionStorage.getItem("lastName")}
                        {...register("lastName", { required: true, })} className="form-control" />
                    {errors.lastName?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                </div>

                <div className="col-md-6">
                    <label className="form-label" >תעודת זהות (כולל ספרת ביקורת)</label>
                    <input onInput={(e) => { sessionStorage.setItem("tz", e.target.value) }} defaultValue={sessionStorage.getItem("tz")}
                        {...register("tz", { required: true, minLength: 9, maxLength: 9, pattern: /^\d+$/ })} className="form-control" />
                    {errors.tz?.type === 'pattern' && <p style={{ color: "red" }}>יש להזין ספרות בלבד</p>}
                    {errors.tz?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                    {errors.tz?.type === 'maxLength' && <p style={{ color: "red" }}>המספר ארוך מ9 ספרות</p>}
                    {errors.tz?.type === 'minLength' && <p style={{ color: "red" }}>המספר קצר מ9 ספרות</p>}

                </div>

                <div className="col-md-6">
                    <label className="form-label">תאריך לידה</label>
                    <input onInput={(e) => { sessionStorage.setItem("dateOfBirth", e.target.value) }} defaultValue={sessionStorage.getItem("dateOfBirth")}
                        type="date" {...register("dateOfBirth", { required: true })} className="form-control" />
                    {errors.dateOfBirth?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">מספר ילדים</label>
                    <input onInput={changeChildren} defaultValue={sessionStorage.getItem("numOfChildren")}
                        type="number" {...register("numOfChildren", { required: true, min: 0 })} className="form-control" />
                    {errors.numOfChildren?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                    {errors.numOfChildren?.type === 'min' && <p style={{ color: "red" }}>המספר קטן מ0</p>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">מין</label>
                    <select className="form-select" aria-label="Default select example"
                        onInput={(e) => { sessionStorage.setItem("sex", e.target.value) }} defaultValue={sessionStorage.getItem("sex")}
                        {...register("sex", { required: true })}>
                        <option value="גבר">גבר</option>
                        <option value="אישה">אישה</option>
                    </select>
                    {errors.sex?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                </div>


                <div className="col-md-4">
                    <label className="form-label">קופת חולים</label>
                    <select className="form-select" aria-label="Default select example"
                        onInput={(e) => { sessionStorage.setItem("healthFund", e.target.value) }} defaultValue={sessionStorage.getItem("healthFund")}
                        {...register("healthFund", { required: true })}>
                        <option value="מכבי">מכבי</option>
                        <option value="מאוחדת">מאוחדת</option>
                        <option value="כללית">כללית</option>
                        <option value="לאומית">לאומית</option>
                    </select>
                    {errors.healthFund?.type === 'required' && <p style={{ color: "red" }}>זהו שדה חובה</p>}
                </div>

                {
                    numOfChildren?.map((c) => <ChildForm key={c} number={c} register={register} errors={errors}></ChildForm>)
                }

                <input type="submit" value="לשמירת הטופס" class="btn btn-primary" />
            </form>

        </div>
    )
}
