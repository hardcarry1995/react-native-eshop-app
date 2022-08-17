import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';

const ImageWithPlaceholder = ({ source, style, resizeMode }) => {

  const [loading, setLoading] = useState(false);
  const [isFail, setFail] = useState(false);

  const onLoad = () => {
    setLoading(false);
  }
  const onError = () => {
    setLoading(false);
    setFail(true);
  }

  return (
    <View >
      <Image
        source={isFail ? require('../assets/NoImage.jpeg') : source}
        style={style}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoad={onLoad}
        onError={onError}
      />

      {loading && <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#666" />
      </View>}
    </View>

  )
}

export default ImageWithPlaceholder 