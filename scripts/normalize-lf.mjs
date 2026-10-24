import fs from 'fs'

const files = [
  'src/components/DietPlan.tsx',
  'src/components/UserProfile.tsx',
  'src/components/AnatomyVisualizer.tsx',
  'src/components/CharakaMatraCalculator.tsx',
  'src/lib/deshaSatmyaEngine.ts',
  'src/App.tsx',
  'src/components/LandingPage.tsx',
  'src/components/Dashboard.tsx',
  'src/components/SmartPopups.tsx',
]

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8')
    fs.writeFileSync(f, content.replace(/\r\n/g, '\n'), 'utf8')
    console.log(`Normalized ${f}`)
  }
}
