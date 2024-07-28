const NumberInput = ({ label, value, onChange }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <label style={{
            marginBottom: '20px',
        }}>
            <span>{label}</span>
            <input type="number" value={value} onChange={onChange} />
        </label>
    );
}

export default NumberInput;