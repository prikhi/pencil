function CanvasMemento(node, metadata) {
    this.node = node;
    this.metadata = {};
    for (name in metadata)  this.metadata[name] = metadata[name];
}
