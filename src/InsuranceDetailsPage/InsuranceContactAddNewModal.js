import React from 'react';
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default function InsuranceContactAddNewModal(props) {
    return (
        <Modal show={props.showModal} onHide={props.close}>
            <Form onSubmit={(e) => props.createInsuranceContact(e)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Insurance Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl name="title" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl name="firstName" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl name="lastName" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Phone</ControlLabel>
                        <FormControl name="phone" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Ext</ControlLabel>
                        <FormControl name="ext" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Fax</ControlLabel>
                        <FormControl name="fax" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Email</ControlLabel>
                        <FormControl name="email" onChange={(e) => props.changeHandler(e)} type="text"></FormControl>
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