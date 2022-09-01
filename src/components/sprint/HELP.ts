if(localStorage.chapter === "6"  && this.parameters) {
  if(localStorage.userId) {
    const allUserWords = await getAlluserWords();
    const allUserWordId = allUserWords.filter((word: IGetUsersWords) => word.difficulty !== "study").map((word: someData) => word.wordId);
    // sprintState.userHardWords = allUserWordId.map(async (id: string ) => await getWordById(id));
    allUserWordId.forEach(async (id: string) => {
      const word = await getWordById(id);
      sprintState.userHardWords.push(word);
    });
    await makeVisibleCurrentSprintPage(this.sprintIntroCard.element, this.sprintResultsPage.element, this.sprintGamePage.element, "flex");
    await this.customUpdateGameCardContent();
    console.log(sprintState.userHardWords);
  }
}