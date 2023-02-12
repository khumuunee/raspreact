import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'

const ITEM_HEIGHT = 90
const ITEM_PADDING_TOP = 2
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
}

const SelectScripts = (props) => {
  let deletedScriptName = ''

  const handleChange = (event) => {
    let {
      target: { value },
    } = event
    value = value.filter((val) =>
      props.savedScriptNames.filter((x) => x !== deletedScriptName).includes(val),
    )
    props.setSelectedScriptNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  const deleteSavedScripts = (event) => {
    deletedScriptName = event.currentTarget.value
    props.deleteScript(event.currentTarget.value)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 400, height: '24px' }}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={props.selectedScriptNames}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          style={{ height: '24px', top: '2px', paddingBottom: '3px' }}
        >
          {props.savedScriptNames.map((name) => (
            <MenuItem
              key={name}
              value={name}
              onClick={(event) =>
                props.onClickMenuItem(event, name, props.selectedScriptNames.indexOf(name) > -1)
              }
            >
              <Checkbox checked={props.selectedScriptNames.indexOf(name) > -1} />
              <ListItemText primary={name} />
              <IconButton
                value={name}
                onClick={deleteSavedScripts}
                color="primary"
                aria-label="add to shopping cart"
              >
                <DeleteIcon />
              </IconButton>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SelectScripts
