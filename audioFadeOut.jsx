var fadeDuration = 5; // duration in seconds
var comp = app.project.activeItem;

if (!comp || !(comp instanceof CompItem)) {
    alert("Please select an active composition.");
} else if (comp.selectedLayers.length === 0) {
    alert("Please select at least one layer.");
} else {
    app.beginUndoGroup("Fade Out with Stereo Mixer");

    var fadeTime = fadeDuration;

    comp.selectedLayers.forEach(function (layer) {
        var fx = layer.property("ADBE Effect Parade").property("Stereo Mixer");
        if (!fx) {
            fx = layer.property("ADBE Effect Parade").addProperty("Stereo Mixer");
        }
        if (!fx) {
            alert("Failed to add Stereo Mixer effect to layer: " + layer.name);
            return;
        }

        var leftLevel = fx.property(1); // Left Level (percent)
        var rightLevel = fx.property(2); // Right Level (percent)

        var layerOut = layer.outPoint;
        var fadeStart = layerOut - fadeDuration / comp.frameRate;

        var marker = new MarkerValue("FADE OUT");
        layer.property("Marker").setValueAtTime(fadeStart, marker);

        leftLevel.expression = 'var marker = thisLayer.marker.key("FADE OUT").time; linear(time, marker, thisLayer.outPoint, 100, 0);';
        rightLevel.expression = 'var marker = thisLayer.marker.key("FADE OUT").time; linear(time, marker, thisLayer.outPoint, 100, 0);';
    });

    app.endUndoGroup();
}
