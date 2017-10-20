import React from 'react';
import InsuranceDetailsForm from './InsuranceDetailsForm';

export default class InsuranceDetails extends React.Component {
    render() {
        let render;

        if(this.props.insurance.insuranceId) {
            render = 
                <div className="formContainer"> 
                    <h3>{this.props.insurance.name}</h3>
                    <hr />

                    <div className="clearfix">
                        <div className="btn-group pull-right">
                            <button className="btn" onClick={this.props.disableFormControls === true ? this.props.makeFormEditable : this.props.cancel}>{this.props.disableFormControls === true ? "Edit" : "Cancel"}</button>
                            <button className="btn" onClick={this.props.save} disabled={this.props.disableFormControls}>Save</button>
                        </div>
                    </div>

                    <InsuranceDetailsForm insurance={this.props.insurance}
                        facilities={this.props.facilities}
                        disableFormControls={this.props.disableFormControls}
                        handler={this.props.changeHandler}
                        checkboxHandler={this.props.checkboxHandler}/>
                </div>
        }
        return (
            <div>
                {render}
            </div>
        )
    }
}