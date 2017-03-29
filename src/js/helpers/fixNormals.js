function fixNormal(vector) {
    var t = vector.y;
    vector.y = -vector.z;
    vector.z = t;
}


module.exports = function( mesh ){
  mesh.faces.forEach(function (face, i) {

      /// fixNormal(face.normal);  <--- NOT NEEDED

      face.vertexNormals.forEach(function (vertex,i) {
          if (!vertex.hasOwnProperty('fixed')) {
              fixNormal(vertex);
              vertex.fixed = true;
          }
      });
  });
  //mesh.computeVertexNormals();
  mesh.normalsNeedUpdate = true;
  mesh.verticesNeedUpdate = true;
};
