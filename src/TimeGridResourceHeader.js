import PropTypes from 'prop-types'
import React from 'react'

class TimeGridResourceHeader extends React.Component {
  static propTypes = {
    accessors: PropTypes.object,
    resource: PropTypes.object,
    idx: PropTypes.number,
  }

  render() {
    return (
      <div className="rbc-row rbc-row-resource">
        <div key={`resource_${this.props.idx}`} className="rbc-header">
          {this.props.accessors.resourceTitle(this.props.resource)}
        </div>
      </div>
    )
  }
}

export default TimeGridResourceHeader
