export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

export function createFloatingHearts(button: HTMLElement): void {
  const heartsContainer = document.getElementById('floating-hearts');
  if (!heartsContainer) return;
  
  const buttonRect = button.getBoundingClientRect();
  
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart-float absolute text-xl';
    heart.style.left = buttonRect.left + Math.random() * 40 + 'px';
    heart.style.top = buttonRect.top + Math.random() * 40 + 'px';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
      if (heartsContainer.contains(heart)) {
        heartsContainer.removeChild(heart);
      }
    }, 2000);
  }
}
