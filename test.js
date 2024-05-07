function trimTime(date) {
    return new Date(date.toISOString().split('T')[0]);
}

function main() {
    const currentDate = new Date();
    console.log(currentDate);
    const trimmedDate = trimTime(currentDate);
    console.log(trimmedDate);
}

main();