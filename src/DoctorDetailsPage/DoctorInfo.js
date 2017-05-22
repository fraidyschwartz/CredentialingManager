import React from 'react';
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default function DoctorInfo(props) {
    return (
        <div>
            <Form>
                <FormGroup className="clearfix">
                    <div className="btn-group pull-right">
                        <button className="btn" onClick="">Edit</button>
                        <button className="btn" type="submit">Save</button>
                    </div>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl name="name" type="text" value={props.doctor.name} disabled={props.editable}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Credentials</ControlLabel>
                    <FormControl name="credentials" type="text" value={props.doctor.credentials} disabled={props.editable}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>SSN</ControlLabel>
                    <FormControl name="ssn" type="text" value={props.doctor.ssn} disabled={props.editable}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Facility</ControlLabel>
                    <FormControl name="facility" type="select" componentClass="select" value={props.doctor.facility} disabled={props.editable}>
                        <option value="null">Please Select...</option>                                     
                        {props.facilities.map(f => <option key={f.facilityId} value={f.facilityId}>{f.facility}</option>)}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Department</ControlLabel>                                  
                    <FormControl name="department" componentClass="select" value={props.doctor.department} disabled={props.editable}>
                        <option value="null">Please Select...</option>   
                        {props.departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.department}</option>)}                                    
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Status</ControlLabel>
                    <FormControl name="status" componentClass="select" value={props.doctor.status} disabled={props.editable}>
                        <option value="null">Please Select...</option>   
                        <option value="1">Active</option> 
                        <option value="0">InActive</option> 
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Notes</ControlLabel>
                    <FormControl name="notes" componentClass="textarea" value={props.doctor.notes} disabled={props.editable}></FormControl>
                </FormGroup>
            </Form>
        </div>
    );
}
                            