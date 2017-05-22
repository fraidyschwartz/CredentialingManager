import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default function DoctorDetails(props) {
    return (
        <div className="formContainer"> 
            <div className="clearfix">
                <div className="btn-group pull-right">
                    <button className="btn" onClick={props.disableFormControls === true ? props.makeFormEditable : props.cancel}>{props.disableFormControls === true ? "Edit" : "Cancel"}</button>
                    <button className="btn" onClick={props.save} disabled={props.disableFormControls}>Save</button>
                </div>
            </div>
            <Form>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl name="name" type="text" value={props.doctor.name} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Credentials</ControlLabel>
                    <FormControl name="credentials" type="text" value={props.doctor.credentials} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>SSN</ControlLabel>
                    <FormControl name="ssn" type="text" value={props.doctor.ssn} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Facility</ControlLabel>
                    <FormControl name="facility" type="select" componentClass="select" value={props.doctor.facility} disabled={props.disableFormControls} onChange={props.handler}>
                        <option value="null">Please Select...</option>                                     
                        {props.facilities.map(f => <option key={f.facilityId} value={f.facilityId}>{f.facility}</option>)}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Department</ControlLabel>                                  
                    <FormControl name="department" componentClass="select" value={props.doctor.department} disabled={props.disableFormControls} onChange={props.handler}>
                        <option value="null">Please Select...</option>   
                        {props.departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.department}</option>)}                                    
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Status</ControlLabel>
                    <FormControl name="status" componentClass="select" value={props.doctor.status} disabled={props.disableFormControls} onChange={props.handler}>
                        <option value="null">Please Select...</option>   
                        <option value="1">Active</option> 
                        <option value="0">InActive</option> 
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Notes</ControlLabel>
                    <FormControl name="notes" componentClass="textarea" value={props.doctor.notes} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
            </Form>
        </div>
    );
}
                            