import React from 'react'
import FormLayout from '../../common/layouts/FormLayout'

export default function FormWrapper() {
    return (
      <FormLayout>
        <div className="form-container">
          <div className="form-area">
            {this.props.children}
          </div>
        </div>
      </FormLayout>
    )
}
