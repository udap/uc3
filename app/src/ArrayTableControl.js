import * as React from 'react'
import { mapStateToControlProps, mapDispatchToControlProps } from '@jsonforms/core'
import { connect } from 'react-redux'
import { ArrayTable } from './ArrayTable'
const ArrayTableControl = function ({ data, handleChange, path, uischema, schema, scopedSchema, ...props }) {
  return <ArrayTable
    value={data}
    title={path}
    items={schema}
    onClick={ev => handleChange(path, ev.value)}
  />
}
export default connect(
  mapStateToControlProps,
  mapDispatchToControlProps
)(ArrayTableControl)
