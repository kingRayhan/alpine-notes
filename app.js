document.addEventListener("alpine:init", () => {
  Alpine.store("notes", {
    data: localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : [],
    currentNoteId: null,
    syncStorage() {
      localStorage.setItem(
        "notes",
        JSON.stringify(this.sortedNotesByLastEdited)
      );
    },
    createNote() {
      const id = Date.now();
      this.data = [
        { id, title: "", body: "", lastEdited: Date.now() },
        ...this.data,
      ];
      this.currentNoteId = id;
      this.syncStorage();
    },
    get current() {
      return this.data.find((note) => note.id === this.currentNoteId);
    },
    get sortedNotesByLastEdited() {
      return this.data.sort((a, b) => b.lastEdited - a.lastEdited);
    },
    setCurrentNoteByIndex(index) {
      this.currentNoteId = this.data[index].id;
    },
    touchCurrentNote() {
      this.current.lastEdited = Date.now();
      this.syncStorage();
    },
    deleteNoteById(id) {
      if (this.data.length === 1) {
        this.createNote();
      }

      if (confirm("Are you sure you want to delete this note?")) {
        this.data = this.data.filter((note) => note.id !== id);
        this.syncStorage();
        this.setCurrentNoteByIndex(0);
      }
    },
    init() {
      console.log(this.data);
      if (!this.data.length) {
        this.createNote();
      } else {
        this.setCurrentNoteByIndex(0);
      }
    },
  });
});
