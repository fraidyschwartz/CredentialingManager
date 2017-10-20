import React from 'react';
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';

export default function DoctorAddNewModal(props) {
    return (
        <Modal show={props.showModal} onHide={props.close}>
            <Form onSubmit={(e) => props.createDoctor(e)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Doctor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl name="name" required="required" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Credentials</ControlLabel>
                        <FormControl name="credentials" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Facility</ControlLabel>
                        <FormControl name="facility" componentClass="select" onChange={(e) => props.changeHandler(e)} >
                            <option value="null">Please Select...</option>                                     
                            {props.facilities.map(f => <option key={f.facilityId} value={f.facilityId}>{f.facility}</option>)}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Department</ControlLabel>                                  
                        <FormControl name="department" componentClass="select" onChange={(e) => props.changeHandler(e)} >
                            <option value="null">Please Select...</option>   
                            {props.departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.department}</option>)}                                    
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Status</ControlLabel>
                        <FormControl name="status" componentClass="select" onChange={(e) => props.changeHandler(e)} >
                            <option value="null">Please Select...</option>   
                            <option value="1">Active</option> 
                            <option value="0">Inactive</option> 
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl name="notes" componentClass="textarea" onChange={(e) => props.changeHandler(e)} ></FormControl>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                    <Button onClick={props.close}>Cancel</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}