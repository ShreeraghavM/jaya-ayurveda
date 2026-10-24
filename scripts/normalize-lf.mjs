import fs from 'fs'
import path from 'path'

const files = [
  'src/components/DietPlan.tsx',
  'src/components/UserProfile.tsx',
  'src/components/AnatomyVisualizer.tsx',
  'src/components/CharakaMatraCalculator.tsx',
  'src/lib/deshaSatmyaEngine.ts',
]

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8')
    fs.writeFileSync(f, content.replace(/\r\n/g, '\n'), 'utf8')
    console.log(`Normalized ${f}`)
  }
}
