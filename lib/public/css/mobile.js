import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'body': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'header': {
    'background': '#535353',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#979797' }],
    'height': [{ 'unit': 'vh', 'value': 6 }],
    'width': [{ 'unit': 'vw', 'value': 100 }]
  },
  'header container': {
    'paddingTop': [{ 'unit': '%V', 'value': 0.05 }]
  },
  'header container img': {
    'display': 'flex'
  },
  'main': {
    'height': [{ 'unit': 'vh', 'value': 67 }]
  },
  'footer': {
    'height': [{ 'unit': 'vh', 'value': 10 }],
    'background': '#D8D8D8',
    'fontFamily': 'Helvetica-Oblique',
    'fontSize': [{ 'unit': 'px', 'value': 14 }],
    'color': '#000000'
  },
  'form-group': {
    'height': [{ 'unit': 'px', 'value': 400 }]
  },
  'btnbtn-selected': {
    'background': '#B80000',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#979797' }],
    'fontFamily': 'Helvetica-Bold',
    'fontSize': [{ 'unit': 'px', 'value': 11 }],
    'color': '#FFFFFF'
  }
});
