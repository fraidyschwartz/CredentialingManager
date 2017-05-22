import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Checkbox } from 'react-bootstrap';

export default function InsuranceDetails(props) {
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
                    <FormControl name="name" type="text" value={props.insurance.name} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Address 1</ControlLabel>
                    <FormControl name="address1" type="text" value={props.insurance.address1} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Address 2</ControlLabel>
                    <FormControl name="address2" type="text" value={props.insurance.address2} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>City</ControlLabel>
                    <FormControl name="city" type="text" value={props.insurance.city} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>State</ControlLabel>
                    <FormControl name="state" type="text" value={props.insurance.state} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Zip</ControlLabel>
                    <FormControl name="zip" type="text" value={props.insurance.zip} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Fax</ControlLabel>
                    <FormControl name="fax" type="tel" value={props.insurance.fax} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email" type="email" value={props.insurance.email} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Group Contract #</ControlLabel>
                    <FormControl name="groupContractNumber" type="text" value={props.insurance.groupContractNumber} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Facilities</ControlLabel>   
                    {console.log(props.insuranceFacilities)}{/*props.insuranceFacilities.find(i => i == f.facilityId) || false*/}
                    {props.facilities.map(f => <Checkbox name="insuranceFacility" key={f.facilityId} value={f.facilityId} disabled={props.disableFormControls} checked={props.insuranceFacilities.includes(f.facilityId)} onChange={(e) => props.checkboxHandler(e)}>{f.facility}</Checkbox>)}
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Notes</ControlLabel>
                    <FormControl name="notes" componentClass="textarea" value={props.insurance.notes} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Necessary Documents</ControlLabel>
                    <FormControl name="necessaryDocs" componentClass="textarea" value={props.insurance.necessaryDocs} disabled={props.disableFormControls} onChange={props.handler}></FormControl>
                </FormGroup>
            </Form>
        </div>
    );
}
                            