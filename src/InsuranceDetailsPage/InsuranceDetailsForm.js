import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import InsuranceFacilityCheckbox from './InsuranceFacilityCheckbox';

export default class InsuranceDetailsForm extends React.Component {
    render() {
        return (
            <Form>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl name="name" type="text" value={this.props.insurance.name} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Address 1</ControlLabel>
                    <FormControl name="address1" type="text" value={this.props.insurance.address1} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Address 2</ControlLabel>
                    <FormControl name="address2" type="text" value={this.props.insurance.address2} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>City</ControlLabel>
                    <FormControl name="city" type="text" value={this.props.insurance.city} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>State</ControlLabel>
                    <FormControl name="state" type="text" value={this.props.insurance.state} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Zip</ControlLabel>
                    <FormControl name="zip" type="text" value={this.props.insurance.zip} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Fax</ControlLabel>
                    <FormControl name="fax" type="tel" value={this.props.insurance.fax} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email" type="email" value={this.props.insurance.email} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Group Contract #</ControlLabel>
                    <FormControl name="groupContractNumber" type="text" value={this.props.insurance.groupContractNumber} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Facilities</ControlLabel>  
                    {this.props.facilities.map(f => <InsuranceFacilityCheckbox key={f.facilityId} facility={f} 
                        checkboxHandler={this.props.checkboxHandler}  disableFormControls={this.props.disableFormControls}/>)}
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Notes</ControlLabel>
                    <FormControl name="notes" componentClass="textarea" value={this.props.insurance.notes} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Necessary Documents</ControlLabel>
                    <FormControl name="necessaryDocs" componentClass="textarea" value={this.props.insurance.necessaryDocs} disabled={this.props.disableFormControls} onChange={this.props.handler}></FormControl>
                </FormGroup>
            </Form>
        )
    }
}

