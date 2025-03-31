editModeSet = true;

function setElementEdit(element)
{
    if (!element.closest(".sidebar") && !element.closest("#diceroller"))
    {
        if (element.tagName === 'TEXTAREA') {
            element.readOnly = !editModeSet;
        } else if (element.tagName === 'INPUT' &&  element.type !== 'checkbox' &&  element.type !== 'file') {
           element.readOnly = !editModeSet;
        } else
        {
            element.disabled = !editModeSet;
        }
    }
}

function editMode()
{
    editModeSet = !editModeSet;
    
    document.getElementById('nav-editMode').innerHTML = editModeSet ? "Режим Просмотра" : "Режим Редактирования";
    
    document.querySelectorAll('input, textarea, select, button, .rank-dot, .rank-selector').forEach(element => {
        setElementEdit(element);
    });
}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                node.querySelectorAll('input, textarea, select, button, .rank-dot, .rank-selector').forEach(element => {
                    setElementEdit(element);
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    editMode();
    observer.observe(document.body, { childList: true, subtree: true });
});
