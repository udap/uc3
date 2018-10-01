/* import { isObjectArrayControl, optionIs } from '@jsonforms/core'

export default isObjectArrayControl(optionIs('layout', 'VertcalLayout'))
*/
import { isObjectArrayControl, scopeEndsWith } from '@jsonforms/core'

export default isObjectArrayControl(scopeEndsWith('comments'))
