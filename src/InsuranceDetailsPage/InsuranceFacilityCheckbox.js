import React from 'react';
import {Checkbox} from 'react-bootstrap';

export default function InsuranceFacilityCheckbox(props) {
    // constructor() {
    //     super();
    //     this.state = {
    //         isChecked: false
    //     }
    // }
    // change(e) {
    //     this.setState({isChecked : !isChecked});
    //     this.props.checkboxHandler(e);
    // }

    // render() {
        return (
            <Checkbox
                      value={props.facility.facilityId} 
                      checked={props.facility.selected} 
                      disabled={props.disableFormControls} 
                      onChange={props.checkboxHandler}>
                {props.facility.facility}
            </Checkbox>
        )
    // }
}