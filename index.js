'use strict';

import React from 'react-native';

const {
   View,
   Component,
   StyleSheet,
   TouchableOpacity,
   Animated,
   PropTypes
} = React;

class Modal extends Component {
   constructor() {
      super();

      this.state = {
         opacity: new Animated.Value(0),
         scale: new Animated.Value(0.8),
         offset: new Animated.Value(0)
      };
   }
   setPhase(toValue) {
      if (this.state.open != toValue) {
         const {animationDuration, animationTension} = this.props;
         Animated.timing(
            this.state.opacity,
            {
               toValue: toValue,
               duration: animationDuration
            }
         ).start();

         Animated.spring(
            this.state.scale,
            {
               toValue: toValue ? 1 : 0.8,
               tension: animationTension
            }
         ).start();

         setTimeout(() => {
            if (toValue)
               this.props.modalDidOpen();
            else {
               this.setState({open: false, renderedContent: undefined});
               this.props.modalDidClose();
            }
         }, animationDuration);
      }
   }
   render() {
      const {opacity, open, scale, offset, renderedContent} = this.state;
      const {overlayOpacity} = this.props;
      console.log(opacity)
      return (
         <View
         pointerEvents={open ? 'auto' : 'none'}
         style={[styles.absolute, styles.container, {
           width: this.props.viewport.width,
           height: this.props.viewport.height,
         }]}>
         <TouchableOpacity
           style={[styles.absolute, {
            width: this.props.viewport.width,
            height: this.props.viewport.height,
           }]}
           onPress={this.close.bind(this)}
           activeOpacity={0.75}>
              <Animated.View style={{flex: 1, opacity: opacity, backgroundColor: 'rgba(0, 0, 0, ' + overlayOpacity + ')'}} />
           </TouchableOpacity>

            <Animated.View
               style={[
                  styles.defaultModalStyle,
                  this.props.style,
                  {opacity: opacity, transform: [{scale}, {translateY: offset}]}
               ]}>
               {this.props.renderContent()}
            </Animated.View>
         </View>
      );
   }

   // public methods
   open() {
      this.setPhase(1);
      this.setState({open: true});
   }
   close() {
      this.setPhase(0);
   }
   animateOffset(offset) {
      Animated.spring(
         this.state.offset,
         {toValue: offset}
      ).start();
   }
}

Modal.propTypes = {
   overlayOpacity: PropTypes.number,
   animationDuration: PropTypes.number,
   animationTension: PropTypes.number,
   modalDidOpen: PropTypes.func,
   modalDidClose: PropTypes.func,
   renderContent: PropTypes.func
};

Modal.defaultProps = {
   overlayOpacity: 0.75,
   animationDuration: 200,
   animationTension: 40,
   modalDidOpen: () => undefined,
   modalDidClose: () => undefined,
   renderContent: () => undefined
};


const styles = StyleSheet.create({
   absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)'
   },
   container: {
      justifyContent: 'center',
   },
   defaultModalStyle: {
      borderRadius: 2,
      margin: 40,
      padding: 10,
      backgroundColor: '#F5F5F5'
   }
});

export default Modal;
