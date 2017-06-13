import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'body': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'header': {
    'background': '#535353',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#979797' }],
    'height': [{ 'unit': 'vh', 'value': 15 }],
    'width': [{ 'unit': 'vw', 'value': 100 }]
  },
  'header container': {
    'paddingTop': [{ 'unit': 'vh', 'value': 3 }]
  },
  'main': {
    'height': [{ 'unit': 'vh', 'value': 70 }]
  },
  'center-block': {
    'display': 'block',
    'marginLeft': [{ 'unit': 'string', 'value': 'auto' }],
    'marginRight': [{ 'unit': 'string', 'value': 'auto' }]
  },
  'footer': {
    'height': [{ 'unit': 'vh', 'value': 12 }],
    'background': '#D8D8D8',
    'fontFamily': 'Helvetica-Oblique',
    'fontSize': [{ 'unit': 'px', 'value': 14 }],
    'color': '#000000',
    'display': 'flex',
    'alignContent': 'center',
    'justifyContent': 'space-around'
  },
  'footer left-content': {
    'height': [{ 'unit': '%V', 'value': 0.8 }],
    'width': [{ 'unit': '%H', 'value': 0.28 }],
    'marginTop': [{ 'unit': '%V', 'value': 0.02 }],
    'background': 'white'
  },
  'footer center-content': {
    'height': [{ 'unit': '%V', 'value': 0.8 }],
    'width': [{ 'unit': '%H', 'value': 0.28 }],
    'marginTop': [{ 'unit': '%V', 'value': 0.02 }],
    'background': 'white'
  },
  'footer right-content': {
    'height': [{ 'unit': '%V', 'value': 0.8 }],
    'width': [{ 'unit': '%H', 'value': 0.28 }],
    'marginTop': [{ 'unit': '%V', 'value': 0.02 }],
    'background': 'white'
  },
  'form-group': {
  },
  'btnbtn-selected': {
    'background': '#B80000',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#979797' }],
    'fontFamily': 'Helvetica-Bold',
    'fontSize': [{ 'unit': 'px', 'value': 11 }],
    'color': '#FFFFFF'
  }
});
