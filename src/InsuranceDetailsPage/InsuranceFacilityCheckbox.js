import React from 'react';
import {Checkbox} from 'react-bootstrap';

export default class InsuranceFacilityCheckbox extends React.Component {
    render() {
        return (
            <Checkbox value={this.props.facility.facilityId} checked={this.props.facility.selected} disabled={this.props.disableFormControls} onChange={(e) => this.props.checkboxHandler(e)}>{this.props.facility.facility}</Checkbox>
        )
    }
}